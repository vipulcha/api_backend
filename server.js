const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express(); 
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",(req,res) => {
    res.send("Hello!")
})


mongoose.connect('mongodb+srv://vipulch0301767:Vipul%402001@cluster0.w6ru9pv.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const ShooySchema = new mongoose.Schema({
    entries: [
        {
            title: String,
            data: String,
        },
    ],
});

const HelioSchema = new mongoose.Schema({
    entries: [
        {
            title: String,
            data: String,
        },
    ],
});

const CommentSchema = new mongoose.Schema({
  postId: mongoose.Types.ObjectId,
  text: String,
});

const CommentModel = mongoose.model('Comment', CommentSchema);
const ShooyModel = mongoose.model('Shooy', ShooySchema);
const HelioModel = mongoose.model('Helio', HelioSchema);

app.get('/api/shooy-entries/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ postId });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/helio-entries/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ postId });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/shooy-entries/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    const newComment = new CommentModel({ postId, text });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/helio-entries/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    const newComment = new CommentModel({ postId, text });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/shooy-entries/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    await ShooyModel.updateOne({}, { $pull: { entries: { _id: postId } } });   
    await CommentModel.deleteMany({ postId });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// app.delete('/api/shooy-entries/:postId', async (req,res) => {
//   try {
//       const { postId } = req.params;
   
//       await ShooyModel.updateOne({}, { $pull: { entries: { _id: postId } } });
//       res.sendStatus(204);
//   }catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
// });

app.delete('/api/shooy-entries/:postId/comments/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    

    await CommentModel.findByIdAndDelete(commentId);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/helio-entries/:postId/comments/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    

    await CommentModel.findByIdAndDelete(commentId);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/shooy-entries', async (req,res) => {
    try{
        const { title, data} = req.body;
        const newShooyEntry = {title, data};
        const shooyDoc = await ShooyModel.findOneAndUpdate({},
            {$push: {entries: newShooyEntry}}, 
            {new: true, upsert:true});
            res.status(201).json(shooyDoc.entries);
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/shooy-entries' , async (req,res) => {
    try{
        const shooyDoc = await ShooyModel.findOne();
        res.json(shooyDoc ? shooyDoc.entries : []);
    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/helio-entries', async (req, res) => {
    try {
      const { title, data } = req.body;
      const newHelioEntry = { title, data };
      const helioDoc = await HelioModel.findOneAndUpdate(
        {},
        { $push: { entries: newHelioEntry } },
        { new: true, upsert: true }
      );
      res.status(201).json(helioDoc.entries);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  app.get('/api/helio-entries', async (req, res) => {
    try {
      const helioDoc = await HelioModel.findOne();
      res.json(helioDoc ? helioDoc.entries : []);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


  

  app.delete('/api/helio-entries/:postId', async (req,res) => {
    try {
        const { postId } = req.params;
        await CommentModel.deleteMany({ postId });
        await HelioModel.updateOne({}, { $pull: { entries: { _id: postId } } });
        res.sendStatus(204);
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
  });



app.listen(PORT,() => {
    console.log('Server is running !');
})