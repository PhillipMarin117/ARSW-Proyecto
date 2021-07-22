package edu.escuelaing.arsw.app.ProyectoARSW.model;

import javax.websocket.Session;
import java.util.UUID;

public class Player {

    private UUID id;
    private int left;
    private int bottom;
    private boolean isDead;
    private String nickname;
    private int score;
    private String room;
    private Session  session;

    public Player(String nickname, int score, int bottom,String room, Session session) {
        this.bottom = bottom;
        this.nickname = nickname;
        this.score = score;
        this.id = UUID.randomUUID();
        this.isDead = false;
        this.room = room;
        this.session= session;
        this.left = 220;

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public int getLeft() {
        return left;
    }

    public void setLeft(int left) {
        this.left = left;
    }

    public int getBottom() {
        return bottom;
    }

    public void setBottom(int bottom) {
        this.bottom = bottom;
    }

    public boolean isDead() {
        return isDead;
    }

    public void setDead(boolean dead) {
        isDead = dead;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    @Override
    public String toString() {
        return "Player{" +
                "id='" + id + '\'' +
                ", left=" + left +
                ", bottom=" + bottom +
                ", isDead=" + isDead +
                ", nickname='" + nickname + '\'' +
                ", score=" + score +
                '}';
    }
}
