const FACES = ['B2P', 'P2B', '✠', 'IDEAS', '30', 'GO'];

export default function Dice3D({ rolling }: { rolling: boolean }) {
  return (
    <div className={`dice-scene ${rolling ? 'rolling' : ''}`}>
      <div className="dice-wrap" aria-hidden="true">
        <div className="dice">
          <div className="dice-face face-front">{FACES[0]}</div>
          <div className="dice-face face-back">{FACES[1]}</div>
          <div className="dice-face face-right">{FACES[2]}</div>
          <div className="dice-face face-left">{FACES[3]}</div>
          <div className="dice-face face-top">{FACES[4]}</div>
          <div className="dice-face face-bottom">{FACES[5]}</div>
        </div>
      </div>
    </div>
  );
}