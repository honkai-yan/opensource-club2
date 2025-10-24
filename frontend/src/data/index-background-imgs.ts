import { indexBackgroundBaseURL } from "@/api/apis";

let indexBackgroundImgs: string[] = [
  "bedroom.jpg",
  "cyberpunk.jpg",
  "dock.jpg",
  "giand_bridge.jpg",
  "gorgeous01.jpg",
  "mountain&forest.jpg",
  "room.jpg",
  "scene.jpg",
  "street.jpg",
  "sunset.jpg",
  "train.jpg",
];

indexBackgroundImgs = indexBackgroundImgs.map(
  (item) => indexBackgroundBaseURL + item
);

export default indexBackgroundImgs;
