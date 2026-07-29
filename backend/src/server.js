const app=require("./app") // ./--> means looking in same folder.

const PORT =5000;

app.listen(PORT,function(){
    console.log(`Server is running on port ${PORT}`);
});

