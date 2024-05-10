const B = 3;
const W = 2;
const E = 4;
let g_map = [
    [B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B],
    [B, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, B],
    [B, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, B],
    [B, 0, 0, W, W, W, W, 0, 0, W, 0, 0, W, W, W, W, W, W, 0, 0, W, 0, 0, W, W, W, W, W, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, W, 0, 0, W, 0, 0, W, W, W, W, W, W, 0, 0, W, 0, 0, W, 0, 0, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, W, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, W, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, W, W, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, W, 0, 0, W, W, W, W, W, W, W, 0, 0, W, W, W, W, W, W, W, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, B],
    [B, 0, 0, W, W, W, W, W, W, W, W, W, W, 0, 0, W, W, W, W, W, W, W, W, W, W, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, W, W, 0, 0, W, 0, 0, 0, 0, 0, W, 0, 0, B],
    [B, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, W, W, W, W, W, W, 0, 0, W, W, W, W, 0, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, W, W, W, W, W, W, W, W, 0, 0, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, W, W, W, B],
    [B, 0, 0, W, 0, 0, W, 0, 0, W, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, W, W, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, W, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, W, 0, 0, 0, 0, 0, W, W, W, W, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, W, W, W, W, W, W, W, W, W, W, 0, 0, 0, W, W, W, W, W, W, W, W, W, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, B],
    [B, 0, 0, W, W, W, W, W, W, W, W, W, W, 0, 0, W, 0, 0, W, W, W, W, W, W, W, W, W, W, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, W, W, W, W, W, W, W, W, W, W, 0, 0, W, 0, 0, W, W, W, W, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, W, 0, 0, W, 0, 0, B],
    [B, 0, 0, W, W, W, 0, 0, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, 0, 0, W, 0, 0, W, W, W, B],
    [B, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, B],
    [B, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, B],
    [B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, E, B]
];

function drawMap() {
    for (var x = 0; x < 32; x++) {
        for (var y = 0; y < 32; y++) {
            if (g_map[x][y] != 0){
                for (var z = 0; z < g_map[x][y]; z++) {
                    var boxes = new Cube();
                    boxes.color = [0.8, 1.0, 1.0, 1.0];
                    boxes.textureNum = 2;
                    if (g_map[x][y] == E) {
                        boxes.matrix.translate(0, -.75, 0);
                        boxes.matrix.scale(0.9, 0.9, 0.9);
                        boxes.matrix.translate(x-16, 2, y-16);    
                    } else {
                        boxes.matrix.translate(0, -.75, 0);
                        boxes.matrix.scale(0.9, 0.9, 0.9);
                        boxes.matrix.translate(x-16, z, y-16);
                    }
                    boxes.renderFaster();
                }
            }
        }
    }
}