import React, { useState, useEffect } from "react";
import { Container, VStack, Text, Button, Select, Box, Input, useColorModeValue } from "@chakra-ui/react";

const TASK_TIMES = {
  Emails: 30 * 60,
  Review: 60 * 60,
  Calculation: 60 * 60,
  Research: 60 * 60,
  "Deep Focus": 90 * 60,
  Sketching: 30 * 60,
  Break: 10 * 60,
};

const Index = () => {
  const [selectedTask, setSelectedTask] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    let timer;
    if (isCounting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isCounting) {
      setIsCounting(false);
      setIsTimeUp(true);
      setTimeout(() => setIsTimeUp(false), 10000);
    }
    return () => clearInterval(timer);
  }, [isCounting, timeLeft]);

  const startCountdown = () => {
    if (selectedTask) {
      setTimeLeft(TASK_TIMES[selectedTask]);
      setIsCounting(true);
    }
  };

  const stopCountdown = () => {
    if (pin === "2024") {
      setIsCounting(false);
      setTimeLeft(0);
      setShowPinInput(false);
      setPin("");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bg={isCounting ? "black" : isTimeUp ? "blue.500" : "white"}>
      <VStack spacing={4}>
        {!isTimeUp && (
          <>
            <Text fontSize="2xl">Select a Task</Text>
            <Select placeholder="Select task" onChange={(e) => setSelectedTask(e.target.value)}>
              {Object.keys(TASK_TIMES).map((task) => (
                <option key={task} value={task}>
                  {task}
                </option>
              ))}
            </Select>
            <Button onClick={startCountdown} colorScheme="teal">
              Start
            </Button>
          </>
        )}
        <Button onClick={() => setShowPinInput(true)} colorScheme="red" variant="outline" position="absolute" top="10px" right="10px" borderColor={useColorModeValue("black", "white")}>
          Stop
        </Button>
        {showPinInput && (
          <Box>
            <Input placeholder="Enter PIN" type="password" value={pin} onChange={(e) => setPin(e.target.value)} />
            <Button onClick={stopCountdown} colorScheme="red">
              Submit
            </Button>
          </Box>
        )}
        {isCounting && (
          <Text fontSize="6xl" color="white" fontFamily="monospace">
            {formatTime(timeLeft)}
          </Text>
        )}
        {isTimeUp && (
          <Text fontSize="6xl" color="green.500" fontFamily="monospace">
            Time's Up
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
