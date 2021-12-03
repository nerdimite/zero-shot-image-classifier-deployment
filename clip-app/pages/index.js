import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Label,
  Textbox,
  Button,
  Badge,
  Progress,
  SecondaryButton,
} from "../components/core";

const Results = (props) => {
  const colorOptions = [
    { bg: "bg-purple-200", text: "purple-600" },
    { bg: "bg-blue-200", text: "blue-600" },
    { bg: "bg-red-200", text: "red-600" },
    { bg: "bg-green-200", text: "green-600" },
    { bg: "bg-pink-200", text: "pink-600" },
    { bg: "bg-yellow-200", text: "yellow-600" },
  ];
  let color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
  return (
    <div>
      <Badge
        label={`${props.label}: ${props.value}%`}
        bgColor={color.bg}
        textColor={"text-" + color.text}
        size="regular"
      />
      <Progress
        value={props.value}
        bgColor={color.bg}
        barColor={"bg-" + color.text}
      />
    </div>
  );
};

export default function Home() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [key, setKey] = useState("");
  const [image, setImage] = useState("");
  const [classes, setClasses] = useState([]);
  const [output, setOutput] = useState(null);

  const loadModel = async () => {
    setStatus(
      "🚧 Loading Model into Memory, Please Wait for around 30 seconds..."
    );
    setLoading(true);

    try {
      const raw_response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": key,
        },
        method: "GET",
      });
      const response = await raw_response.json();
      console.log(response);
    } catch (err) {
      console.log(err);
    }

    setStatus("⚡ Model is Ready");
    setLoading(false);
  };

  const predict = async () => {
    setStatus("⏳ The Model is Generating the Title");
    setLoading(true);

    try {
      const raw_response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": key,
        },
        method: "POST",
        body: JSON.stringify({
          image: image,
          classes: classes,
        }),
      });
      const response = await raw_response.json();
      console.log(response);
      setOutput(response["body"]["output"]);
    } catch (err) {
      console.log(err);
      alert("Something went wrong! Please try again.");
    }

    setStatus("⚡ Model is Ready");
    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Zero-Shot Image Classifier</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl mt-4">
            🤖{" "}
            <span className="font-bold text-blue-600">
              Zero-Shot Image Classifier
            </span>{" "}
            📷
          </h1>

          <div className="mt-3 text-lg sm:text-xl text-gray-700">
            A CLIP based Zero-Shot Image Classifier{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://cellstrathub.com"
              className="text-blue-600 hover:text-purple-600 transition ease-in-out duration-200"
            >
              Powered by CellStrat Hub API
            </a>{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/nerdimite/zero-shot-image-classifier-deployment"
            >
              <div
                className="py-2 px-3  inline-block rounded-full \
                  bg-blue-200 text-sm hover:cursor-pointer hover:ring-1 hover:ring-blue-600 \
                  transition ease-in-out duration-200"
              >
                <span className="font-semibold text-blue-600">
                  Get Source Code{" "}
                </span>
                💻
              </div>
            </a>
          </div>
        </div>

        <Paper>
          <Label>Endpoint</Label>
          <div className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-600 mb-3">
            https://api.cellstrathub.com/
            <input
              className="border-none focus:outline-none w-1/2"
              placeholder="username/api-name"
              onChange={(e) => {
                setEndpoint("https://api.cellstrathub.com/" + e.target.value);
              }}
            />
          </div>

          <Label>API Key</Label>
          <Textbox
            id="key"
            type="password"
            placeholder="Enter your Hub API Key"
            onChange={(e) => {
              setKey(e.target.value);
            }}
          />
          <div className="flex float-right">
            <SecondaryButton
              color="gray"
              disabled={loading}
              onClick={async () => {
                await loadModel();
              }}
            >
              Load Model
            </SecondaryButton>
          </div>

          <Label>Upload Image</Label>
          <input
            type="file"
            className="mb-3 border-none focus:outline-none w-1/2"
            placeholder="username/api-name"
            onChange={(event) => {
              let files = event.target.files;
              let reader = new FileReader();
              reader.readAsDataURL(files[0]);

              reader.onload = (e) => {
                let image_uri = e.target.result.split(",")[1];
                setImage(image_uri);
              };
            }}
          />

          <div className="flex justify-between items-center flex-wrap">
            <Label emoji="🏷️">Classes</Label>
          </div>
          <Textbox
            id="classes"
            placeholder="Enter multiple classes separated by commas. Example: plane, dog, cat"
            onChange={(e) => {
              let _classes = e.target.value
                .split(",")
                .map((item, idx) => "a photo of " + item.trim());
              console.log(_classes);
              setClasses(_classes);
            }}
          />
          <div className="flex justify-between items-start flex-wrap">
            <p>
              <span className="font-semibold text-gray-700">Status:</span>{" "}
              {status}
            </p>
            <div className="flex items-center justify-center mt-2 gap-2">
              <Button
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  await predict();
                }}
              >
                Classify Image 📸
              </Button>
            </div>
          </div>
        </Paper>

        <Paper>
          <Label emoji="📊">Predictions</Label>
          {output &&
            output.map((item, idx) => {
              return (
                <Results label={item[0]} value={(item[1] * 100).toFixed(2)} />
              );
            })}
        </Paper>
      </Container>
    </div>
  );
}
