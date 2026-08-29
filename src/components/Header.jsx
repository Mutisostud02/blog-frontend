export default function Header() {
    const bcg = {
        backgroundColor : "skyblue",
        width : "100dvw",
        display : "flex",
        justifyContent : "space-between",
        cursor : "pointer",

    }
    return (
        <header  style={bcg}>
            <h2>Blog App</h2>
            <p style={{padding: "3px"}}><button>Sign-In</button></p>
        </header>
    )
}