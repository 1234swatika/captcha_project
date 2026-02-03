export async function getCaptcha() {
    const res = await fetch("http://localhost:5000/captcha/new");
    return res.json();
}

export async function verifyCaptcha(data) {
    const res = await fetch("http://localhost:5000/captcha/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
