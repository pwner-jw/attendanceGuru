import { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Confetti from "react-confetti";
import "./style.css";

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState("");
  const [total, setTotal] = useState("");
  const [target, setTarget] = useState(75);
  const [canBunk, setCanBunk] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (canBunk === false) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [canBunk]);

  // Remove leading zeros
  const formatNumber = (value) => {
    return value.replace(/^0+/, "") || "0";
  };

  const calculateAttendance = () => {
    const attendedNum = Number(attended);
    const totalNum = Number(total);
    const targetNum = Number(target);

    if (
      totalNum <= 0 ||
      attendedNum > totalNum ||
      attendedNum < 0 ||
      targetNum <= 0 ||
      targetNum > 100
    ) {
      setPopupMessage("❌ Invalid numbers entered!");
      setCanBunk(null);
      return;
    }

    const requiredLectures = Math.ceil(
      ((targetNum / 100) * totalNum - attendedNum) / (1 - targetNum / 100)
    );
    const maxBunkable = Math.floor((attendedNum * 100) / targetNum - totalNum);

    if ((attendedNum / totalNum) * 100 >= targetNum) {
      setPopupMessage(`🎉 You can bunk ${maxBunkable} more lectures!`);
      setCanBunk(true);
    } else {
      setPopupMessage(
        `💀 You need ${requiredLectures} more lectures to reach ${targetNum}% attendance.`
      );
      setCanBunk(false);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      {popupMessage && (
        <div className="popup">
          {canBunk === false && <div className="skull-animation">💀💀💀</div>}
          {popupMessage}
        </div>
      )}

      {canBunk && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <Card className="attendance-box">
        <Card.Body>
          <h1 style={{ color: "#ffcc00", fontWeight: "bold" }}>
            🎯 Attendance Guru
          </h1>
          <p style={{ fontSize: "20px", opacity: "0.8" }}>
            "Plan smart, skip wisely!"
          </p>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>📖 Lectures Attended</Form.Label>
              <Form.Control
                type="number"
                value={attended}
                onChange={(e) => setAttended(formatNumber(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>📆 Total Lectures</Form.Label>
              <Form.Control
                type="number"
                value={total}
                onChange={(e) => setTotal(formatNumber(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>🎯 Target Attendance %</Form.Label>
              <Form.Control
                type="number"
                value={target}
                onChange={(e) => setTarget(formatNumber(e.target.value))}
              />
            </Form.Group>

            <Button
              onClick={calculateAttendance}
              className="w-100 attendance-btn"
            >
              🔢 Check My Bunks!
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
