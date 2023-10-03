import { Component } from "react";
const buttonStyle = { width: "100px" };

const constraints = {
  video: { facingMode: "user" },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      stream: null,
      hasStream: false,
      scale: 1,
      filter: "",
    };
  }
  componentDidMount() {
    this.onCapture();
  }
  handleSuccess = (stream) => {
    console.log("Get webCam stream Successful");
    const video = document.getElementById("video");
    video.srcObject = stream;
    this.setState({ stream: stream, hasStream: true });
  };

  handleError = (error) => {
    console.log("No Video Stream");
  };

  onCapture = () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this.handleSuccess)
      .catch(this.handleError);
  };
  stopCapture = () => {
    const video = document.getElementById("video");
    if (video.srcObject) {
      const streams = this.state.stream.getVideoTracks();
      streams.map((stream) => {
        stream.stop();
      });
      video.srcObject = null;
      this.setState({ hasStream: false });
    }
  };
  addWatermark = (canvas) => {
    const canvasContext = canvas.getContext("2d");
    canvasContext.font = "oblique 72px cursive";
    canvasContext.lineWidth = 3;
    canvasContext.fillStyle = "Gray";
    canvasContext.strokeStyle = "White";
    canvasContext.strokeText("Watermark", canvas.width / 4, canvas.height / 2);
    canvasContext.fillText("Watermark", canvas.width / 4, canvas.height / 2);
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <canvas id={"canvas"} width={640} height={480}></canvas>
        <video
          id={"video"}
          onPlay={() => {
            const getFrame = () => {
              const canvas = document.getElementById("canvas");
              const canvas2D = canvas.getContext("2d");
              const video = document.getElementById("video");
              canvas2D.reset();
              canvas2D.filter = this.state.filter;
              canvas2D.drawImage(
                video,
                canvas.width / 2 - (canvas.width * this.state.scale) / 2,
                canvas.height / 2 - (canvas.height * this.state.scale) / 2,
                canvas.width * this.state.scale,
                canvas.height * this.state.scale
              );
              requestAnimationFrame(getFrame);
            };
            requestAnimationFrame(getFrame);
          }}
          autoPlay
          style={{ display: "none" }}
        ></video>
        <div>
          {this.state.hasStream && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button style={{ width: "150px" }} onClick={this.stopCapture}>
                release stream
              </button>
              <div>
                <button
                  style={buttonStyle}
                  onClick={() => {
                    this.setState({ scale: this.state.scale + 0.1 });
                  }}
                >
                  zoom in
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => {
                    this.setState({ scale: this.state.scale - 0.1 });
                  }}
                >
                  zoom out
                </button>
              </div>
              <div>
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onChange={() => {
                    const gray = document.getElementById("gray");
                    const blur = document.getElementById("blur");
                    let filterString = "";
                    if (gray.checked) filterString += "grayscale(80%)";
                    if (blur.checked) filterString += "blur(4px)";
                    this.setState({ filter: filterString });
                  }}
                >
                  <button
                    style={buttonStyle}
                    onClick={() => {
                      this.setState({ filter: "" });
                      const gray = document.getElementById("gray");
                      const blur = document.getElementById("blur");
                      gray.checked = blur.checked = false;
                    }}
                  >
                    original
                  </button>
                  <input type="checkbox" id={"gray"} />
                  <label>grayscale</label>
                  <input type="checkbox" id={"blur"} />
                  <label>blur</label>
                </div>
              </div>
              <button
                style={buttonStyle}
                onClick={() => {
                  const canvas = document.getElementById("canvas");
                  const link = document.createElement("a");
                  link.download = "download.png";
                  this.addWatermark(canvas);
                  link.href = canvas.toDataURL();
                  link.click();
                }}
              >
                save
              </button>
            </div>
          )}
          {!this.state.hasStream && (
            <button style={{ width: "150px" }} onClick={this.onCapture}>
              create stream
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default App;
