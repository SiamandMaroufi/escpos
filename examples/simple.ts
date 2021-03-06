import {Console, Network, Usb, Websocket} from "../src/Adapters";
import {Barcode, CodeTable, Font, Justification, PDF417ErrorCorrectLevel, PDF417Type, Position, QRErrorCorrectLevel,
    RasterMode, TextMode, Underline} from "../src/Commands";
import Image from "../src/Image";
import Printer from "../src/Printer";

const values = [
    {
        text: "Hello",
        text2: "World"
    },
    {
        text: "Foo",
        text2: "Bar"
    }
];

async function test() {
    try {
        const consoleAdapter = new Console(console.log, 32);
        const networkAdapter = new Network("192.168.1.30", 9100, 1);
        const usbAdapter = new Usb();
        const websocketAdapter = new Websocket("ws://127.0.0.1:9001/test");
        const printer = await new Printer(consoleAdapter, "CP865").open();
        const image = await Image.load("http://i.imgur.com/uJUPbC3.png");

        await printer.init()
                .setCodeTable(CodeTable.PC865)
                .setJustification(Justification.Center)
                .raster(image, RasterMode.Normal)
                .setJustification(Justification.Right)
                .writeLine("Just some text, a newline will be added.")
                .raster(image, RasterMode.DualWidthAndHeight)
                .barcode("1234567890123", Barcode.EAN13, 50, 2, Font.A, Position.Below)
                .qr("We can put all kinds of cool things in these...", QRErrorCorrectLevel.M, 8)
                .writeList(values.map(v => `${v.text} ... ${v.text2}`)) // Prints one entry per line
                .feed(4)
                .cut(true)
                .close();
    } catch (err) {
        console.log(err);
    }
}

test();
