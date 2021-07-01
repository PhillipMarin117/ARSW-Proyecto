package edu.escuelaing.arsw.app.ProyectoARSW.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class GameController {

    @GetMapping("/game")
    @ResponseBody
    public String status() {
        return "index";
    }

}