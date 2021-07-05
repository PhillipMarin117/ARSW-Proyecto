package edu.escuelaing.arsw.app.ProyectoARSW.model;

public class Puntaje {
    private String nombre;
    private int puntaje;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getPuntaje() {
        return puntaje;
    }

    public void setPuntaje(int puntaje) {
        this.puntaje = puntaje;
    }

    @Override
    public String toString() {
        return "Puntaje{" +
                "nombre='" + nombre + '\'' +
                ", puntaje=" + puntaje +
                '}';
    }
}
