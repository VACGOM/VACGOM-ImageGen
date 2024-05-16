import {createCanvas, GlobalFonts, loadImage, SKRSContext2D} from '@napi-rs/canvas';
import {drawRoundRect} from './utils.js';
import {ImageGenerationRequest} from './types/ImageGenerationRequest.js';

GlobalFonts.registerFromPath('assets/Pretendard-Bold.otf', 'Pretendard Bold');
GlobalFonts.registerFromPath('assets/Pretendard-Regular.otf', 'Pretendard Regular');
GlobalFonts.registerFromPath('assets/Pretendard-Medium.otf', 'Pretendard Medium');

function drawIdPill(ctx: SKRSContext2D, id: string): void {
    const idString = `@${id}`;
    ctx.font = '33px Pretendard Bold';
    const fontWidth = ctx.measureText(idString).width;
    drawRoundRect(ctx, 170, 365, 170 + fontWidth + 55, 435, 1000, '#fff');

    ctx.fillStyle = '#333D4B';
    ctx.fillText(idString, 197, 410);
}

function drawTitle(ctx: SKRSContext2D, line1: string, line2: string | null): void {
    ctx.font = '65px Pretendard Bold';
    ctx.fillStyle = '#fff';
    if (line2) {
        ctx.fillText(line1, 163, 1330, 764);
        ctx.fillText(line2, 163, 1410, 764);
    } else {
        ctx.fillText(line1, 163, 1410, 764);
    }
}

function drawInocluationDate(ctx: SKRSContext2D, date: string): void {
    ctx.font = '35px Pretendard Medium';
    ctx.fillStyle = '#fff';
    ctx.fillText('접종일자', 163, 1475);

    ctx.font = '35px Pretendard Regular';
    ctx.fillStyle = '#C6E0FF';
    ctx.fillText(date, 295, 1475);
}

export async function generateImage(request: ImageGenerationRequest): Promise<Buffer> {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');

    const cardImage = await loadImage(request.cardImageUrl);
    const mask = await loadImage(request.maskImageUrl);
    const icon = await loadImage(request.iconImageUrl);

    ctx.drawImage(cardImage, 0, 0, cardImage.width, cardImage.height);
    const boxWidth = 700;
    const boxHeight = 850;

    // Calculate the scaling factor to fit the icon within the bounding box
    const factor = Math.min(boxWidth / icon.width, boxHeight / icon.height);

    icon.width = icon.naturalWidth * factor;
    icon.height = icon.naturalHeight * factor;

    const iconX = cardImage.width / 2 - icon.width / 2;
    const iconY = cardImage.height / 2 - icon.height / 2 + 80;

    ctx.drawImage(icon, iconX, iconY, icon.width, icon.height);
    ctx.drawImage(mask, 0, 0, mask.width, mask.height);
    drawIdPill(ctx, request.userId);

    if (request.diseaseName.length > 8) {
        drawTitle(ctx, request.diseaseName, `(${request.vaccinationName})`);
    } else {
        drawTitle(ctx, `${request.diseaseName} (${request.vaccinationName})`, null);
    }

    drawInocluationDate(ctx, request.inoculationDate);

    const pngData = await canvas.encode('png');

    return pngData;
}
