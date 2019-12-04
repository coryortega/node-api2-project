const express = require('express');

const Posts = require('../data/db.js');

//make sure to invoke it and use uppercase R
const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    
    const postData = req.body;

    if (!postData.title || !postData.contents) {
        res
        .status(400)
        .json({errorMessage: "Please provide title and contents for the posts"});
    } else {
        Posts.insert(postData)
        .then(post =>{
            res.status(201).json(post)
        })
        .catch(
            error => {
                console.log('error', error);
                res
                .status(500)
                .json({ errorMessage: "There was an error while saving the post to the database"});
            }); 
    
    }

});

router.post('/:id/comments', (req, res) => {
    
    const commentData = req.body;

    Posts.insertComment(commentData)
    .then(comment => {
        if(!commentData.text) {
        res
        .status(400)
        .json({errorMessage: "Please provide text for the comment."});
        } else {
            res.status(201).json(comment)
        }
    })
    .catch( error => {
        console.log('error on GET /users', error);
        res
        .status(404)
        .json({ errorMessage: "The post with the specified ID does not exist."});
    });
});

router.get('/', (req, res) => {

    Posts.find(req.params)
     .then(posts => {
       res.status(200).json(posts);
     })
     .catch(error => {
       // log error to database
       console.log(error);
       res.status(500).json({
         message: 'Error retrieving the posts',
       });
     });
   });


router.get('/:id/comments', (req, res) => {

 Posts.findPostComments(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the posts',
    });
  });
});

router.get('/:id', (req, res) => {
 Posts.findCommentById(req.params.id)
  .then(post => {
    if (post.length > 0) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'post not found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the post',
    });
  });
});


router.delete('/:id', (req, res) => {
 Posts.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'post deleted' });
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the hub',
    });
  });
});

router.put('/:id', (req, res) => {
  const changes = req.body;
 Posts.update(req.params.id, changes)
  .then(post => {
    if (!post) {
      res.status(404).json({ message: 'The post could not be found' });
    } else if(!changes.title || !changes.contents){
      res.status(400).json({ message: "update title or contents"})
    } else {
      res.status(200).json(post);
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the post',
    });
  });
});



module.exports = router;