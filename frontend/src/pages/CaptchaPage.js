import { useEffect, useState } from "react";
import { getCaptcha, verifyCaptcha } from "../services/api";

function CaptchaPage() {
    const [captcha, setCaptcha] = useState(null);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null);

    useEffect(() => {
        getCaptcha().then(setCaptcha);
    }, []);

    const submit = async () => {
        const res = await verifyCaptcha({
            captchaId: captcha.captchaId,
            userAnswer: answer
        });
        setResult(res);
    };

    if (!captcha) return null;

    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
            <h2>{captcha.question}</h2>
            <input value={answer} onChange={e => setAnswer(e.target.value)} />
            <br /><br />
            <button onClick={submit}>Verify</button>

           {result && (
    <div style={{ marginTop: 20 }}>
        <h4>Behavior Metrics</h4>
        <pre>{JSON.stringify(result.behavior, null, 2)}</pre>

        <h4>Behavior Hash (SHA-256)</h4>
        <p style={{
            wordBreak: "break-all",
            fontSize: "12px",
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "5px"
        }}>
            {result.behaviorHash}
        </p>
        <h4>Difficulty: {captcha.difficulty}</h4>

    </div>
)}

        </div>
    );
}

export default CaptchaPage;
