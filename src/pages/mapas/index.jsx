import styles from './styles.module.css';

export default function Mapas (){
    return(
        <div>
        <iframe
            title="ROTA ROXA"
            src="https://www.google.com/maps/d/embed?mid=1NrZESVWmv8C0DlpWJpVjhzOJvHxPMDE"
            className={styles.mapa}
            loading="Lazy">
        </iframe>
        </div>
    )
}