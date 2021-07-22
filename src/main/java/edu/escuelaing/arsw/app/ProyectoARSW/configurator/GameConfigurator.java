package edu.escuelaing.arsw.app.ProyectoARSW.configurator;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import javax.websocket.server.ServerEndpoint;

@Configuration
@EnableScheduling
public class GameConfigurator {

    @Bean
    public ServerEndpointExporter  serverEndpointExporter (){
        System.out.println("Está entrando en el serverEndpointExporter");
        return new ServerEndpointExporter();

    }
}
