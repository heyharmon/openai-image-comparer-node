require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const multipart = require('@fastify/multipart');
const OpenAI = require('openai');
const fs = require('fs');
const util = require('util');
const path = require('path');
const pipeline = util.promisify(require('stream').pipeline);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Register multipart plugin for handling file uploads
fastify.register(multipart);

// Serve static files
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

// Route to handle image comparison
fastify.post('/compare', async (request, reply) => {
  try {
    const files = await request.saveRequestFiles();
    if (files.length !== 2) {
      throw new Error('Please provide exactly two images');
    }

    const beforeImage = files.find(f => f.fieldname === 'before');
    const afterImage = files.find(f => f.fieldname === 'after');

    if (!beforeImage || !afterImage) {
      throw new Error('Please provide both before and after images');
    }

    // Analyze images with OpenAI Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Compare these two images and list all the differences between them. Focus on specific, concrete changes." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${beforeImage.mimetype};base64,${fs.readFileSync(beforeImage.filepath, 'base64')}`,
              },
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${afterImage.mimetype};base64,${fs.readFileSync(afterImage.filepath, 'base64')}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Clean up uploaded files
    for (const file of files) {
      fs.unlinkSync(file.filepath);
    }

    return {
      differences: response.choices[0].message.content
    };
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
