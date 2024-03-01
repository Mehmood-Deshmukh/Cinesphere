//Cinesphere Backend Server by Mehmood Deshmukh

//importing necessary Packages
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(
  process.env.MongoUrl,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Schema definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  favoriteGenres: [JSON],
  genres:[JSON],
  watchlist: [
    {
      tmdbId: { type: Number, required: true },
      title: { type: String, required: true },
      poster_path: { type: String },
      release_date: { type: Date },
      vote_average: { type: Number },
      media_type: { type: String, enum: ["movie", "tv"] },
      watched: { type: Boolean, default: false },
    },
  ],
  avatarUrl: { type: String },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

app.use(cors());
app.use(bodyParser.json());

// Routes
const getRandomOption = (options) => {
  return options[Math.floor(Math.random() * options.length)];
};

// Register user
app.post("/api/register", async (req, res) => {
  const { username, email, password, about, favoriteGenres } = req.body;
  console.log(req.body);
  try {
     // Generate random avatar options
     const accessoriesType = 'Blank';
     const hairColor = getRandomOption(['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray']);
     const facialHairType = 'Blank'
     const facialHairColor = getRandomOption(['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'Platinum', 'Red']);
     const clotheType = getRandomOption(['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck']);
     const clotheColor = getRandomOption(['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'Pink', 'Red', 'White']);
     const eyeType = 'Happy'
     const eyebrowType = 'RaisedExcited';
     const mouthType = 'Smile'
     const skinColor = getRandomOption(['Tanned', 'Pale', 'Light', 'Brown',]);
 
     // Construct avatar URL
     const avatarUrl = `https://avataaars.io//?avatarStyle=Circle&accessoriesType=${accessoriesType}&hairColor=${hairColor}&facialHairType=${facialHairType}&facialHairColor=${facialHairColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered!" });
    }

    const user = new User({ username, email, password, about, favoriteGenres, avatarUrl });
    await user.save();
    res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user!" });
  }
});


// Login user
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Fetch user data by ID
app.get("/api/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Add media to watchlist
app.post("/api/user/:userId/watchlist", async (req, res) => {
  const userId = req.params.userId;
  const { Type, Id, poster_path, release_date, vote_average, media_type, watched , genre} = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the movie already exists in the watchlist
    const existingMovie = user.watchlist.find((movie) => movie.tmdbId === Id);
    if (existingMovie) {
      return res
        .status(400)
        .json({ error: "Movie already exists in watchlist" });
    }

    // If movie doesn't exist, add it to the watchlist


    //valid Genres because Some specifuc Genres Cause the Api Request To Not send Any Reuslt
    //Found out they are the ones with a five-digit ID or a space in the name

    const validGenres = genre.filter(g => !/\s/.test(g.name) && g.id.toString().length !== 5);
    user.genres = [...user.genres, ...validGenres];

    user.watchlist.push({ tmdbId: Id, title: Type, poster_path, release_date, vote_average, media_type, watched });
    await user.save();
    console.log("Media added to watchlist successfully");
    res
      .status(200)
      .json({ message: "Media added to watchlist successfully", user });
  } catch (error) {
    console.error("Error adding media to watchlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Logout user
app.post("/api/logout", (req, res) => {
  //removing the userID from Local Storage from frontend while logging out 
  res.status(200).json({ message: "Logout successful" });
});

app.patch('/api/user/:userId/watchlist/:tmdbId', async (req, res) => {
  const { userId, tmdbId } = req.params;
  const { watched } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const movieIndex = user.watchlist.findIndex(movie => movie.tmdbId == tmdbId);
    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    user.watchlist[movieIndex].watched = watched;
    await user.save();

    res.json({ message: 'Watchlist updated successfully' });
  } catch (error) {
    console.error('Error updating watchlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
