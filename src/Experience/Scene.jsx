import { Suspense } from "react";
import CustomCamera from "./components/CustomCamera";
import MovingCat from "./models/MovingCat";
import Scene_Ri from "./models/Scene_Ri";
import Scene_Rua from "./models/Scene_Rua";
import Scene_Bigga from "./models/Scene_Bigga";

const Scene = () => {
  return (
    <>
      <CustomCamera />
      <Suspense fallback={null}>
        <MovingCat />
        <Scene_Ri />
        <Scene_Rua />
        <Scene_Bigga />
      </Suspense>
    </>
  );
};

export default Scene;
