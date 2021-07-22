package edu.escuelaing.arsw.app.ProyectoARSW.endpoints;

import edu.escuelaing.arsw.app.ProyectoARSW.model.Player;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

@Controller
@ServerEndpoint("/gameFlappy")
public class GameEndpoints {

    static Queue<Session> sessions = new ConcurrentLinkedQueue<>();

    private Session ownSession = null;

    static HashMap<String, List<Player>> rooms = new HashMap<>();

    private Player player;

    int obstacleTimer = 0;

    boolean bandera = false;

    String playerName = "";

    boolean inGame = false;


    @OnOpen
    public void openConection(Session session){
        System.out.println("Entró en la conección");
        sessions.add(session);
        ownSession = session;

    }

    @OnClose
    public void closeConection(){
        System.out.println("Salió en la conección");
    }

    @OnError
    public void error(Session session, Throwable t) {
    }

    @OnMessage
    public void message(String message, Session session) {
        JSONObject msgJson = new JSONObject(message);
        System.out.println("Estamos dentro del message en On Message: "+msgJson + " Bandera: "+ bandera);
        if (!bandera){
            //System.out.println("Estamos probando la bandera");
            bandera = true;
            new Timer().scheduleAtFixedRate(new TimerTask(){
                @Override
                public void run(){
                    startGame(message);
                    //System.out.println("Estamos dentro del onOpen mi perri");
                    //Log.i("tag", "A Kiss every 5 seconds");
                }
            },0,100);
        }
    }


    private void sendMessage(String room, String message) {

        rooms.get(room).forEach(user -> {
            System.out.println("Este es el message: "+message);
            try {

                user.getSession().getBasicRemote().sendText(message);

            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    private void startGame (String message){

        JSONObject msgJson = new JSONObject(message);
        //System.out.println("Estamos dentro del message en On Message: "+msgJson);
        String messageTipo = msgJson.get("tipo").toString();
        if(messageTipo.equals("gameOver")){
            System.out.println("\n \n  \n \n \n \n \n \n Este es parte del Game Over PLISS !!: " + messageTipo);
        }else{

            String playerName = msgJson.get("playerName").toString();
            String playerScore = msgJson.get("playerScore").toString();
            String playerBottom = msgJson.get("playerBottom").toString();
            String room = msgJson.get("room").toString();

            System.out.println("\n \n \n \n \n  Este es el messageTipo antes del if: " + messageTipo);
            if (!messageTipo.equals("gameOver")){
                //System.out.println("\n \n Este es el messageTipo en START GAME");
                if (rooms.containsKey(room)) {
                    addUser( playerName, playerScore, playerBottom, room);
                    //System.out.println("\n Esta entrando en el If del mssageen endpoint: "+ rooms);
                } else {
                    //System.out.println("\n Estamo dentro del else del endpoint");

                    Player birdPlay = createPlayer(playerName,
                            playerScore,
                            playerBottom,
                            room);
                    List<Player> usuarios = new ArrayList<Player>();
                    usuarios.add(birdPlay);
                    rooms.put(room, usuarios);
                    //System.out.println("Estas son las rooms: "+rooms);
                }
                String msg;
                /*List<Player> playersRoom = (List<Player>) rooms.get(room).stream().map(userPlayer->{
                    return userPlayer;
                });*/
                List<String> playersRoom = new ArrayList<>();
                rooms.get(room).stream().forEach(pr->{
                    System.out.println("esto es una PR: " + pr);
                    String playerFormat = '{' + "\"id\"" + ":" + "\"" + pr.getId() +"\"" + ","
                            + "\"left\"" + ":" + pr.getLeft() + ","
                            + "\"isDead\"" + ":" + pr.isDead() + ","
                            + "\"nickname\"" + ":" + "\"" + pr.getNickname().toString() +"\""+ ","
                            + "\"score\"" + ":" + pr.getScore()  +'}';
                    //playersRoom.add("\"" + playerFormat + "\"");
                    playersRoom.add(playerFormat);
                });

                String playerFormat = '{' + "\"id\"" + ":" + playersRoom.toString() + ","
                        + "\"left\"" + ":" + 0 + ","
                        + "\"isDead\"" + ":" + "\"pos\"" + ","
                        + "\"nickname\"" + ":" + "\"Manguito\"" + ","
                        + "\"score\"" + ":" + true  +'}';

                System.out.println("esto es oooootro player room: " + playersRoom);
                if (obstacleTimer == 0 || obstacleTimer == 3000) {
                    System.out.println("ESTE ES UN IF DEL MENSAJE HOHOHO: " + obstacleTimer);
                    obstacleTimer = 0;
                    msg = '{' + "\"birds\"" + ":" + playersRoom.toString() + ","
                            + "\"highScore\"" + ":" + 0 + ","
                            + "\"tipo\"" + ":" + "\"pos\"" + ","
                            + "\"highScoreNickname\"" + ":" + "\"Manguito\"" + ","
                            + "\"launchObstacle\"" + ":" + true + ","
                            + "\"obstacleHeight\"" + ":" + Math.random() * 130 +'}';
                    //console.log("Esta entrand en if del gametick: ", gameStateObj)
                } else {
                    System.out.println("ESTE ES UN ELSE DEL MENSAJE NYA NYA NYA: " + obstacleTimer);
                    msg = '{' + "\"birds\"" + ":" + playersRoom.toString() + ","
                            + "\"highScore\"" + ":" + 0 + ","
                            + "\"tipo\"" + ":" + "\"pos\"" + ","
                            + "\"highScoreNickname\"" + ":" + "\"Manguito\"" + ","
                            + "\"launchObstacle\"" + ":" + false + ","
                            + "\"obstacleHeight\"" + ":" + "\"\"" +'}';
                    //console.log("Esta entrand en else del gametick: ", gameStateObj)
                }
                obstacleTimer += 100;
                this.sendMessage(room, msg);
            }
        }
    }

    private Player createPlayer(String playerName, String playerScore, String playerBottom, String room){
        int pScore = Integer.parseInt(playerScore);
        int pBottom = Integer.parseInt(playerBottom);

        Player player = new Player(playerName, pScore, pBottom, room, ownSession);
        return player;

    }

    private void addUser(String playerName, String playerScore, String playerBottom, String room) {
        Player actualPlayer = findUser(room,playerName);
        if (actualPlayer == null) {
            player = createPlayer(playerName, playerScore, playerBottom, room);
            rooms.get(room).add(createPlayer(playerName, playerScore, playerBottom, room));
        }else{
            System.out.println("\n \n else de AddUser: "+ playerName);
            rooms.get(room).stream().forEach(userPlayer->{
                if (userPlayer.equals(actualPlayer)){
                    System.out.println("\n \n esta entrando en el IF del ELSE del addUser: " + userPlayer);
                    userPlayer.setBottom(Integer.parseInt(playerBottom));
                    userPlayer.setScore(Integer.parseInt(playerScore));
                }
            });
        }
    }

    private Player findUser(String room, String playerName) {
        return rooms.get(room).stream()
                .filter(user -> user.getNickname().equals(playerName))
                .findFirst().orElse(null);
    }






}
