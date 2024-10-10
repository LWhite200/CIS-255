// Get the SVG container where the cube will be drawn
const svg = document.getElementById('shape-container');
const lines = []; // Array to hold each line element for the cube

// Define the 3D vertices (points) of the cube
const vertices = [
    { x: -1, y: -1, z: -1 }, // A
    { x: 1, y: -1, z: -1 },  // B
    { x: 1, y: 1, z: -1 },   // C
    { x: -1, y: 1, z: -1 },  // D
    { x: -1, y: -1, z: 1 },  // E
    { x: 1, y: -1, z: 1 },   // F
    { x: 1, y: 1, z: 1 },    // G
    { x: -1, y: 1, z: 1 }    // H
];

let scale = 100; // Set the scale for the cube size

// Project 3D coordinates onto the 2D plane of the SVG
function project(vertex) {
    const perspective = 2; // Set a perspective factor for simple 3D effect
    const x = (vertex.x * scale) / (perspective + vertex.z); // Calculate projected x
    const y = (vertex.y * scale) / (perspective + vertex.z); // Calculate projected y

    // Center the projection in the SVG container
    return {
        x: x + svg.clientWidth / 2,
        y: -y + svg.clientHeight / 2
    };
}

// Create lines connecting each vertex based on the cube's edges
function createLines() {
    // Define edges connecting the vertices to form a cube
    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Front face edges
        [4, 5], [5, 6], [6, 7], [7, 4], // Back face edges
        [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges between front and back
    ];

    // Create a line for each edge and add it to the SVG container
    edges.forEach(([start, end]) => {
        const startPos = project(vertices[start]);
        const endPos = project(vertices[end]);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', 'blue'); // Set line color
        line.setAttribute('stroke-width', '2'); // Set line thickness
        line.setAttribute('x1', startPos.x);
        line.setAttribute('y1', startPos.y);
        line.setAttribute('x2', endPos.x);
        line.setAttribute('y2', endPos.y);
        svg.appendChild(line); // Add line to the SVG container
    });
}

// Run the function to create the cube on the screen
createLines();
