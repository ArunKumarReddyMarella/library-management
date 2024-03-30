import { useState, forwardRef } from "react"
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const SignUpDialog = ({ open, handleClose, handleSubmit }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")

  const onSubmit = (event) => {
    event.preventDefault()
    handleSubmit(username, password, role)
  }

  const handleEnterKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit(event)
    }
  }

  const handleRoleChange = (event) => {
    setRole(event.target.value)
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      onKeyDown={handleEnterKeyDown}
    >
      <DialogTitle>Sign Up</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          type="text"
          fullWidth
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControl fullWidth style={{ marginTop: "20px" }}>
          <InputLabel id="role-label">Role</InputLabel>
          <Select labelId="role-label" id="role" value={role} onChange={handleRoleChange}>
            <MenuItem value="">--Select Role--</MenuItem>
            <MenuItem value="guest">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" onClick={onSubmit}>
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  )
}
