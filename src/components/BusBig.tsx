export default function BustripLogoBg({
    className,
}: {
    className?: string;
}) {
    return (
        <div
            className={`
        absolute
        w-full
        h-full
        ${className}
      `}
        >
            <img
                src="/images/vectorxe2.png"
                className="absolute"
                style={{ top: "2%", left: "35%", width: "48%", height: "22%" }}
                alt=""
            />

            <img
                src="/images/vectorxe3.png"
                className="absolute"
                style={{ top: "10%", left: "33%", width: "50%", height: "65%" }}
                alt=""
            />

            <img
                src="/images/veactorxe1.png"
                className="absolute"
                style={{ top: "13%", left: "20%", width: "15%", height: "58%" }}
                alt=""
            />

            <img
                src="/images/vectorxe4.png"
                className="absolute"
                style={{ bottom: "19%", left: "35%", width: "48%", height: "23%" }}
                alt=""
            />
        </div>
    );
}
