let g_legsAngle = 0;
let g_secondJointAngle = 0;
let g_tailAngleX = 15;
let g_tailAngleY = 0;
let x_val = 0;
let y_val = 0;
let g_headTransform = 0;
let g_bodyTransform = 0;
let g_bodyRotate = 0;

function renderDog() {
    // Body 
    var wolfBody = new Cube();

    wolfBody.color = [0.8, 0.8, 0.8, 1.0];
    wolfBody.matrix.translate(16, -0.25+g_bodyTransform, 13.1);
    wolfBody.matrix.rotate(90+g_bodyRotate, 0, 1, 0);
    wolfBody.matrix.scale(0.7, 0.7, 0.7);
    var bodyToPuffy = new Matrix4(wolfBody.matrix);
    var bodyToUpLegL = new Matrix4(wolfBody.matrix);
    var bodyToUpLegR = new Matrix4(wolfBody.matrix);
    var bodyToLowLegL = new Matrix4(wolfBody.matrix);
    var bodyToLowLegR = new Matrix4(wolfBody.matrix);
    var bodyToTail = new Matrix4(wolfBody.matrix);
    wolfBody.matrix.scale(0.4, 0.4, 0.6);

    wolfBody.renderFaster();


    var wolfBodyPuffy = new Cube();
    wolfBodyPuffy.color = [0.8, 0.8, 0.8, 1.0];

    wolfBodyPuffy.matrix = bodyToPuffy;
    wolfBodyPuffy.matrix.translate(-0.05, -0.005, -0.3);
    var puffyToCollar = new Matrix4(wolfBodyPuffy.matrix);
    var puffyToHead = new Matrix4(wolfBodyPuffy.matrix);
    wolfBodyPuffy.matrix.scale(0.5, 0.45, 0.35);

    wolfBodyPuffy.renderFaster();


    var wolfCollar = new Cube();
    wolfCollar.color = [0.8, 0.0, 0.0, 1.0];

    wolfCollar.matrix = puffyToCollar;
    wolfCollar.matrix.translate(0.005, 0.005, -0.0001);
    wolfCollar.matrix.scale(0.49, 0.44, 0.1);

    wolfCollar.renderFaster();



    var wolfTail = new Cube();
    wolfTail.color = [0.8, 0.8, 0.8, 1.0];

    wolfTail.matrix = bodyToTail;
    wolfTail.matrix.translate(0.15, 0.30, 0.425);
    wolfTail.matrix.rotate(90, 1, 0, 0);
    wolfTail.matrix.rotate(-g_tailAngleY, 0, 0, 1);
    wolfTail.matrix.rotate(-g_tailAngleX, 1, 0, 0);
    wolfTail.matrix.scale(0.1, 0.45, 0.1);

    wolfTail.renderFaster();

    // Head
    var wolfFace = new Cube();
    wolfFace.color = [0.8, 0.8, 0.8, 1.0];
    
    wolfFace.matrix = puffyToHead;
    wolfFace.matrix.translate(0.05, 0+g_headTransform, -0.175);
    var FacetoMouth = new Matrix4(wolfFace.matrix);
    var FacetoEarL = new Matrix4(wolfFace.matrix);
    var FacetoEarR = new Matrix4(wolfFace.matrix);
    var PupilL = new Matrix4(wolfFace.matrix);
    var PupilR = new Matrix4(wolfFace.matrix);
    var ScleraL = new Matrix4(wolfFace.matrix);
    var ScleraR = new Matrix4(wolfFace.matrix);
    wolfFace.matrix.scale(0.4, 0.4, 0.175);

    wolfFace.renderFaster();


    var wolfPupilL = new Cube();
    wolfPupilL.color = [0.2, 0.2, 0.2, 1];

    wolfPupilL.matrix = PupilL;
    wolfPupilL.matrix.translate(.25, 0.2, -0.001);
    wolfPupilL.matrix.scale(0.075, 0.075, 0.075);

    wolfPupilL.renderFaster();


    var wolfPupilR = new Cube();
    wolfPupilR.color = [0.2, 0.2, 0.2, 1];

    wolfPupilR.matrix = PupilR;
    wolfPupilR.matrix.translate(.075, 0.2, -0.001);
    wolfPupilR.matrix.scale(0.075, 0.075, 0.075);

    wolfPupilR.renderFaster();


    var wolfScleraL = new Cube();
    wolfScleraL.color = [1, 1, 1, 1];

    wolfScleraL.matrix = ScleraL;
    wolfScleraL.matrix.translate(.3251, 0.2, -0.001);
    wolfScleraL.matrix.scale(0.075, 0.075, 0.075);

    wolfScleraL.renderFaster();


    var wolfScleraR = new Cube();
    wolfScleraR.color = [1, 1, 1, 1]

    wolfScleraR.matrix = ScleraR;
    wolfScleraR.matrix.translate(-0.001, 0.2, -0.001);
    wolfScleraR.matrix.scale(0.075, 0.075, 0.075);

    wolfScleraR.renderFaster();


    var wolfMouth = new Cube();
    wolfMouth.color = [0.85, 0.83, 0.78, 1.0];

    wolfMouth.matrix = FacetoMouth;
    wolfMouth.matrix.translate(0.1, 0, -0.2);
    var Lip = new Matrix4(wolfMouth.matrix);
    var Nose = new Matrix4(wolfMouth.matrix);
    wolfMouth.matrix.scale(0.2, 0.2, 0.205);

    wolfMouth.renderFaster();


    var wolfNose = new Cube();
    wolfNose.color = [0.2, 0.2, 0.2, 1];

    wolfNose.matrix = Nose;
    wolfNose.matrix.translate(0.068, 0.1351, -0.001);
    wolfNose.matrix.scale(0.065, 0.065, 0.065);

    wolfNose.renderFaster();

    var wolfLip = new Cube();
    wolfLip.color = [0.2, 0.2, 0.2, 1];

    wolfLip.matrix = Lip;
    wolfLip.matrix.translate(-0.001, 0.0001, -0.001);
    wolfLip.matrix.scale(0.203, 0.065, 0.2003);

    wolfLip.renderFaster();


    var wolfEarL = new Cube();
    wolfEarL.color = [0.2, 0.2, 0.2, 1.0];

    wolfEarL.matrix = FacetoEarL;
    wolfEarL.matrix.translate(0, 0.4, 0.125);
    wolfEarL.matrix.scale(0.15, 0.14, 0.05);

    wolfEarL.renderFaster();


    var wolfEarR = new Cube();
    wolfEarR.color = [0.2, 0.2, 0.2, 1.0];

    wolfEarR.matrix = FacetoEarR;
    wolfEarR.matrix.translate(0.25, 0.4, 0.125);
    wolfEarR.matrix.scale(0.15, 0.14, 0.05);

    wolfEarR.renderFaster()

    // Upper Legs
    var wolfUpLegLT = new Cube();
    wolfUpLegLT.color = [0.8, 0.8, 0.8, 1.0];

    wolfUpLegLT.matrix = bodyToUpLegL;
    wolfUpLegLT.matrix.translate(0.275, 0.1, -0.175);
    wolfUpLegLT.matrix.rotate(180, 1, 0, 0);
    wolfUpLegLT.matrix.rotate(-g_legsAngle, 0, 0, 1);
    var UpLTtoLB = new Matrix4(wolfUpLegLT.matrix);
    wolfUpLegLT.matrix.scale(0.125, 0.35, 0.125);

    wolfUpLegLT.renderFaster();


    var wolfUpLegLB = new Cube();
    wolfUpLegLB.color = [0.8, 0.8, 0.8, 1.0];

    wolfUpLegLB.matrix = UpLTtoLB;
    wolfUpLegLB.matrix.translate(0, 0.35, 0);
    wolfUpLegLB.matrix.rotate(g_secondJointAngle, 1, 0, 0);
    wolfUpLegLB.matrix.scale(0.125, 0.225, 0.125);

    wolfUpLegLB.renderFaster();


    var wolfUpLegRT = new Cube();
    wolfUpLegRT.color = [0.8, 0.8, 0.8, 1.0];

    wolfUpLegRT.matrix = bodyToUpLegR;
    wolfUpLegRT.matrix.translate(0.125, 0.1, -0.3);
    wolfUpLegRT.matrix.rotate(180, 1, 0, 0);
    wolfUpLegRT.matrix.rotate(180, 0, 1, 0);
    wolfUpLegRT.matrix.rotate(-g_legsAngle, 0, 0, 1);
    var UpRTtoRB = new Matrix4(wolfUpLegRT.matrix);
    wolfUpLegRT.matrix.scale(0.125, 0.35, 0.125);

    wolfUpLegRT.renderFaster();


    var wolfUpLegRB = new Cube();
    wolfUpLegRB.color = [0.8, 0.8, 0.8, 1.0];

    wolfUpLegRB.matrix = UpRTtoRB;
    wolfUpLegRB.matrix.translate(0, 0.35, 0);
    wolfUpLegRB.matrix.rotate(g_secondJointAngle, 1, 0, 0);
    wolfUpLegRB.matrix.scale(0.125, 0.225, 0.125);

    wolfUpLegRB.renderFaster();


    // Lower Legs
    var wolfLowLegLT = new Cube();
    wolfLowLegLT.color = [0.8, 0.8, 0.8, 1.0];

    wolfLowLegLT.matrix = bodyToLowLegL;
    wolfLowLegLT.matrix.translate(0.275, 0.1, .5999);
    wolfLowLegLT.matrix.rotate(180, 1, 0, 0);
    wolfLowLegLT.matrix.rotate(-g_legsAngle, 0, 0, 1);
    var LowLTtoLB = new Matrix4(wolfLowLegLT.matrix);
    wolfLowLegLT.matrix.scale(0.125, 0.35, 0.125);

    wolfLowLegLT.renderFaster();


    var wolfLowLegLB = new Cube();
    wolfLowLegLB.color = [0.8, 0.8, 0.8, 1.0];

    wolfLowLegLB.matrix = LowLTtoLB;
    wolfLowLegLB.matrix.translate(0, 0.35, 0);
    wolfLowLegLB.matrix.rotate(g_secondJointAngle, 1, 0, 0);
    wolfLowLegLB.matrix.scale(0.125, 0.23, 0.125);

    wolfLowLegLB.renderFaster();


    var wolfLowLegRT = new Cube();
    wolfLowLegRT.color = [0.8, 0.8, 0.8, 1.0];

    wolfLowLegRT.matrix = bodyToLowLegR;
    wolfLowLegRT.matrix.translate(0.125, 0.1, 0.4749);
    wolfLowLegRT.matrix.rotate(180, 1, 0, 0);
    wolfLowLegRT.matrix.rotate(180, 0, 1, 0);
    wolfLowLegRT.matrix.rotate(-g_legsAngle, 0, 0, 1);
    var LowRTtoRB = new Matrix4(wolfLowLegRT.matrix);
    wolfLowLegRT.matrix.scale(0.125, 0.35, 0.125);

    wolfLowLegRT.renderFaster();


    var wolfLowLegRB = new Cube();
    wolfLowLegRB.color = [0.8, 0.8, 0.8, 1.0];

    wolfLowLegRB.matrix = LowRTtoRB;
    wolfLowLegRB.matrix.translate(0, 0.35, 0);
    wolfLowLegRB.matrix.rotate(g_secondJointAngle, 1, 0, 0);
    wolfLowLegRB.matrix.scale(0.125, 0.23, 0.125);

    wolfLowLegRB.renderFaster();
}