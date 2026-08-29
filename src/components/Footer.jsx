export default function Footer() {
    const bcg = {
        backgroundColor : "skyblue",
        height : "5dvh",
        display : "flex",
        justifyContent : "space-between",
        position : "absolute",
        bottom:0,
        minWidth : "100dvw",
        padding : "3px"
    }

    return (
        <footer style={bcg}>
            <p>CC@2026</p>
            <p>Terms and Conditions</p>
        </footer>
    )
}