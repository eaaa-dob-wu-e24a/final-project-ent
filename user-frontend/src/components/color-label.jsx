export default function ColorLabel({ colorCode }) {
  const colorPalette = {
    "#000000": "Sort",
    "#5337FF": "Blå",
    "#72CA81": "Grøn",
    "#7F8992": "Grå",
    "#9E29BB": "Lilla",
    "#C1C1C1": "Sølv",
    "#FF3DD4": "Pink",
    "#FF5757": "Rød",
    "#FFB23F": "Orange",
    "#FFE34E": "Gul",
    "#FFFFFF": "Hvid",
  };

  return (
    <div className="flex gap-2 items-center">
      <span
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: colorCode  }}
      ></span>
      <span className="text-gray-600 text-xs">
        {colorPalette[colorCode]} 
      </span>
    </div>
  );
}
