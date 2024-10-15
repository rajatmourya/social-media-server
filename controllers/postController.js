
const getAllPostsController = async (req, res) => {
    console.log(req._id);
    // return res.status(200).send(`These are all the posts`);
    return res.send(success(200, `These are all the posts`));
}

module.exports = {
    getAllPostsController,
};