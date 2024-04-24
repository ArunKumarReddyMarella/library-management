const mongodb = require('mongodb');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

function logToFile(message, filePath) {
    // Append the message to the file
    fs.writeFile(filePath, message + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

// Example usage
const logFilePath = 'log.txt';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000' // Specify the allowed origin(s)
}));
async function connectToMongoDB() {
  const client = await mongodb.MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('lms');
  return db;
}

const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
const headers = { "Authorization": "Bearer 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" };

async function getData(payload) {
  try {
    const response = await axios.post(API_URL, payload, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function generateOutput(prompt, context) {
  const payload = { "inputs": `Analyze this books json data: '${context}' and ${prompt} in format like Book Names:"" and  based on the books json data.`};
  const payload1 = {
    "inputs": `You are a chatbot for a books website. Your task is to assist users by providing book recommendations based on their queries. You will only suggest books from the given json ${context}. If the query doesn't fit into any of the context categories, respond with "Books not found".

    ###
    Here are some examples:

    Query: Can you recommend books on entrepreneurship and starting a business?
    Response: Book Recommendations:
    1. "Bring Your Human to Work" by Erica Keswin
    2. "Employee to Entrepreneur" by Steve Glaveski
    3. "Dropshipping" by James Moore

    Query: I'm interested in novels set in the Victorian era with strong female protagonists.
    Response: Book Recommendations:
    1. "Jane Eyre" by Charlotte Brontë
    2. "Emma" by Jane Austen
    3. "Wuthering Heights" by Emily Brontë

    Query: Do you have any good science fiction books with time travel themes?
    Response: Book Recommendations:
    1. "The Time Machine" by H.G. Wells
    2. "11/22/63" by Stephen King
    3. "Outlander" by Diana Gabaldon

    Query: What books are available on self-development and personal growth?
    Response: Book Recommendations:
    1. "Primal Leadership" by Daniel Goleman
    2. "Drive" by Dan Pink
    3. "Getting Things Done" by David Allen

    Query: I'm looking for books on ancient philosophy, specifically Stoicism.
    Response: Book Recommendations:
    1. "Lives of the Stoics" by Ryan Holiday, Stephen Hansel
    2. "Meditations" by Marcus Aurelius
    3. "The Art of War" by Sunzi

  ###
    
    <<<
    Query: ${prompt}
    >>>
    Books not found
    `
  }
  const output = await getData(payload);
  const generatedText = output[0]['generated_text'].replace(payload.inputs, "");
  console.log(generatedText)
  return generatedText;
}

app.post('/api/generateOutput', async (req, res) => {
  const db = await connectToMongoDB();
  const booksCollection = db.collection('books');
  const books = await booksCollection.find({}).toArray();

  let context = '';
  for (const book of books) {
    const { image, ...bookData } = book;
    context += JSON.stringify(bookData) + '';
  }
  logToFile(context, logFilePath);
  const prompt = req.body.prompt;
  const output = await generateOutput(prompt, context);
  console.log("Output:\n"+output);
  res.json({ output });
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
