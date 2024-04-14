import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";

const app = express();

// inicia motor de plantillas
app.engine("handlebars", handlebars.engine());

// Establezco la ruta de las vistas
app.set("views", `${__dirname}/views`);

//establezco el motor de renderizado
app.set("view engine", "handlebars");

//establezco el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

//utilizo en la ruta base mi grupo de views routes
app.use("/", viewsRouter);

//inicio mi servidor HTTP y lo almaceno en una contante
const PORT = 8080;
const BASE_URL ="http://localhost"
const httpServer = app.listen(PORT, () =>{
    console.log(`Servidor ejecutandose en ${BASE_URL}:${PORT}`);

});

//inicio el servidor socket
const io = new Server(httpServer);

const messages = [];
io.on("connection", socket =>{
    console.log("Nuevo cliente conectado: ", socket.id);

    socket.on ("message", data =>{
        //console.log(`Mensaje: ${data.message}`);
        messages.push(data);

        io.emit("messagesLogs", messages);
    });
    socket.on("userConnect", data => {
        socket.emit("messagesLogs", messages);
        socket.broadcast.emit("newUser", data);
    })
});