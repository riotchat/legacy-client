const messageFile = new Audio("/assets/sounds/message.mp3");

export function message() {
    messageFile.play();
}