export const allProjects = {"appLabWhitelistProxy":{"slug":"appLabWhitelistProxy","published":true,"date":"2023-05-30","title":"appLab Whitelist Proxy","description":"A proxy server to bypass the sandbox restrictions of code.org's AppLab using image manipulation and Node.js","url":"","repository":"benny-nottonson/applabWhitelistProxy","content":"\n\n`applabWhitelistProxy` is a Node.js-based proxy server designed to bypass the sandbox restrictions imposed by code.org's AppLab platform. This program allows users to execute code that would normally be blocked by the AppLab sandbox, enabling them to access additional functionalities and extend the capabilities of their projects.\n\nThe main concept behind `applabWhitelistProxy` involves intercepting requests made by the AppLab platform and modifying the responses to bypass the sandbox limitations. The proxy server leverages image manipulation techniques to embed executable code within innocuous-looking images. By manipulating the pixel data of these images, the server can inject additional code that will be executed by the browser running the AppLab environment.\n\nTo use `applabWhitelistProxy`, you need to run the Node.js server on a machine accessible from the AppLab environment. Once the server is up and running, you configure the AppLab platform to send its requests through the proxy. When the AppLab platform sends a request for an image, the proxy intercepts it, modifies the response by embedding the necessary additional code, and returns the modified image to the browser.\n\nBy breaking the sandbox restrictions of AppLab, `applabWhitelistProxy` opens up possibilities for executing code that would otherwise be prohibited. This allows users to experiment with advanced functionalities, interact with external APIs, or implement custom features not provided by the original platform.\n\nThe `applabWhitelistProxy` project is hosted on GitHub in the [benny-nottonson/applabWhitelistProxy](https://github.com/benny-nottonson/applabWhitelistProxy) repository. The repository contains the source code and detailed documentation to guide users in setting up and configuring the proxy server. The code is written in Node.js, and it utilizes image manipulation techniques to bypass the AppLab sandbox restrictions.\n\nThis project was coded as a final project for my computer science class in high school, it may no longer work, nor should it be taken as an example of professional work.\n"},"spotifySort-Qwik":{"slug":"spotifySort-Qwik","published":true,"date":"2023-07-15","title":"Spotify Sort-Qwik","description":"A TypeScript port of Spotify Sort with Qwik, upgraded version of SpotifySort-TS","url":"https://spotifysort.vercel.app/","repository":"benny-nottonson/spotifySort-Qwik","content":"\n\n`Spotify Sort Qwik` is a TypeScript port of Spotify Sort, a utility to sort Spotify playlists\n\nIt is coded in the Qwik framework and it was designed using Figma, should work on mobile as well as desktop.\n\nThis is an improved version of SpotifySort-TS, which was coded in NextJS and used older libraries to interact with the Spotify API.\n\nBoth the site itself and Spotify Sort are vastly imrpoved from their original, yet the design and overall idea remain.\n"},"spotifySort-TS":{"slug":"spotifySort-TS","published":true,"date":"2023-06-30","title":"Spotify Sort-TS","description":"A TypeScript port of Spotify Sort with NextJS, deprecated by Spotify Sort Qwik","url":"","repository":"benny-nottonson/spotifySort-TS","content":"\n\n`Spotify Sort TS` is a TypeScript port of Spotify Sort, a utility to sort Spotify playlists\n\nIt is coded in NextJS, and uses tailwind-css and three.js to render 3d animations to the screen, it was designed using Figma and should work on mobile as well as desktop.\n\nThe runtime is significantly faster than the original Python version, and the UI is much more responsive.\n\nThis project is now deprecated and has been replaced with a version coded using Qwik\n"},"spotifySort":{"slug":"spotifySort","published":true,"date":"2023-02-08","title":"Spotify Sort","description":"A Python app that uses Color Coherence Vectors in order to sort Spotify Playlists. Built with Numpy and OpenCV, based on a paper from Cornell University.","url":"https://github.com/benny-nottonson/spotifySort","repository":"benny-nottonson/spotifySort","content":"\n\n`Spotify Sort` is a Python utility designed to sort Spotify playlists based on the colors of their album covers. The project leverages the concept of Color Coherence Vectors (CCV) to accurately analyze and compare the dominant colors in album artwork. By sorting playlists based on color similarity, users can create visually cohesive and aesthetically pleasing arrangements.\n\nTo use `Spotify Sort`, you need a Spotify account and Python version 3.9 or higher. The utility provides a user-friendly command-line interface, allowing you to easily authenticate with your Spotify account and specify the playlist you want to sort. The program then retrieves the album covers for each track in the playlist and extracts the dominant colors using Color Coherence Vectors.\n\nThe algorithm used in `Spotify Sort` applies a loop sorting approach over multiple iterations to find the shortest overall distance between all color vectors. This process ensures that visually similar album covers are grouped together, creating a smooth transition of colors throughout the sorted playlist. The chosen approach of using Color Coherence Vectors has demonstrated higher accuracy compared to a previously attempted method utilizing a Self-Organization Map.\n\nThe `Spotify Sort` project is publicly available on GitHub in the [benny-nottonson/spotifySort](https://github.com/benny-nottonson/spotifySort) repository. The repository contains the source code and documentation to guide users in setting up and running the utility. The code is written in Python and utilizes various libraries and APIs to interact with the Spotify platform and perform color analysis on the album covers.\n\nBy using `Spotify Sort`, users can enhance the visual experience of their Spotify playlists.\n"},"tensorflowImageMorph":{"slug":"tensorflowImageMorph","published":true,"date":"2022-06-01","title":"tensorflowImageMorph","description":"A tensorflow project to morph from image to image using morph maps and machine learning","url":"","repository":"benny-nottonson/tensorflowImageMorpher","content":"\n\n`tensorflowImageMorph` is a program written in Python 3.11 that utilizes the power of Tensorflow to generate smooth transitions between a set of input images. The project aims to create visually appealing morph animations by analyzing the edges and colors of the input images.\n\nThe main concept behind `tensorflowImageMorph` involves training a deep learning model on a collection of source images. This model learns to recognize and capture the distinctive features of each image, such as color gradients, textures, and object edges. With this learned knowledge, the program generates a warp map, which acts as a visual guide for transitioning from one image to another.\n\nTo use `tensorflowImageMorph`, the user provides a set of source images that represent the start and end points of the morph animation. The program then calculates a series of intermediate images by smoothly transforming the source images based on the generated warp map. The number of steps in the morphing process can be customized to control the level of detail and the speed of the transition.\n\nThe resulting morph animation can be saved as a video or a sequence of images, allowing users to create captivating visual effects or dynamic storytelling elements. The project provides a user-friendly command-line interface that simplifies the process of morphing images and offers flexibility in adjusting various parameters, such as the duration of the animation, the morphing style, and the output format.\n\nThis project is hosted on GitHub, and the source code is available in the [benny-nottonson/tensorflowImageMorpher](https://github.com/benny-nottonson/tensorflowImageMorpher) repository. The codebase is written in Python, leveraging the capabilities of Tensorflow, a popular deep learning framework. The repository includes comprehensive documentation and examples to guide users in getting started with `tensorflowImageMorpher` and exploring its functionalities."},"website":{"slug":"website","published":true,"date":"2023-07-22","title":"bennynottonson.com","description":"A Qwik portfolio site showcasing the work and projects of Benny Nottonson","url":"https://benny-nottonson.vercel.app","repository":"benny-nottonson/benny-nottonson.github.io","content":"\n\n[bennynottonson.com](https://benny-nottonson.vercel.app) is a personal portfolio site created using Qwik, a popular React framework for building static and server-side-rendered web applications. This website serves as a showcase for the work, projects, and achievements of Benny Nottonson.\n\nThe primary purpose of bennynottonson.com is to provide an interactive and visually appealing platform that presents Benny Nottonson's portfolio in a professional and engaging manner. The site incorporates modern design principles and user experience techniques to ensure a seamless browsing experience for visitors.\n\nThe site maintains a perfect lighthouse score on all pages for speed and accessability."}}