#### Separate Images by using DeepAI

As I've been going through my photos and reorganizing/categorizing them, I started to think that with DeepAI and other libraries or detection algorithms it might be possible to run something locally using node to make the API request and handle this for me recursively by moving the images into the proper folders. 

Detecting for landscapes, sports, minimalism, etc off the bat was a bit complex, and I figured using a "wallpapers" folder and splitting it up into two simple folders for private and public would be useful and a great starting point to test the initial methods.

Using the DeepAI documentation [here](https://deepai.org/api-docs/#introduction) and some additional JavaScript, if the value generated was greater than or equal to 0.5 move that image into a folder called "private" and if less than 0.5 move that into folder called "public". Create the folders `$ mkdir public && mkdir private && mkdir source` and then add the images to test into source. Running `$ node dai.js` will check the file and output the results to console. It will loop through the source directory and run the function `AI`.

The [DeepAI](https://deepai.org/) API has request limitations. Go the the official site for more details.