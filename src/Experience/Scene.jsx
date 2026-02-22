import { Suspense } from "react";
import CustomCamera from "./components/CustomCamera";
import Characters from "./models/Characters";
import Winter from "./models/Scene_1_Winter";
import Spring from "./models/Scene_2_Spring";
import Summer from "./models/Scene_3_Summer";
import Fall from "./models/Scene_4_Fall";

const Scene = () => {
  return (
    <>
      <CustomCamera />
      <Suspense fallback={null}>
        <Characters />
        <Winter />
        <Spring />
        <Summer />
        <Fall />
      </Suspense>
    </>
  );
};

export default Scene;
