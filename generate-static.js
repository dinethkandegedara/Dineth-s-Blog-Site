const fs = require('fs-extra');  // Import fs-extra for file system operations
const ejs = require('ejs');      // Import EJS for rendering templates
const path = require('path');     // Import path for path manipulations

// Specify the output directory for the static HTML files
const outputDir = path.join(__dirname, 'public'); // Change this as needed

// Example function to render your blog pages
async function renderBlogPost(post) {
    // Read the EJS template file
    const template = await fs.readFile(path.join(__dirname, 'views', 'post.ejs'), 'utf8');
    
    // Render the template with the post data
    const html = ejs.render(template, { post }); // Replace with your actual data
    
    // Set the output file path for the generated HTML file
    const outputFilePath = path.join(outputDir, `${post.slug}.html`);
    
    // Write the rendered HTML to the output file
    await fs.outputFile(outputFilePath, html);
}

// Main function to generate static files
async function main() {
    // Your blog post data (this should be dynamic in a real app)
    const posts = [
        { title: 'My First Blog', slug: 'my-first-blog', content: 'This is the content.' },
        { title: 'Another Post', slug: 'another-post', content: 'More content here.' }
    ];
    
    // Ensure the output directory exists
    await fs.ensureDir(outputDir);
    
    // Render each post
    for (const post of posts) {
        await renderBlogPost(post);
    }
    
    console.log('Static files generated!');
}

// Execute the main function and handle errors
main().catch(console.error);
