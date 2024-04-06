const mongodb = require('mongodb');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
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

const API_URL = "https://api-inference.huggingface.co/models/google/gemma-7b-it";
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

  const prompt = req.body.prompt;
  const output = await generateOutput(prompt, context);
  res.json({ output });
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});