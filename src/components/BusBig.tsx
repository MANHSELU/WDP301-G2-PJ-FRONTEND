export default function BustripLogoBg(
) {
    return (
        <div
            className="
                absolute top-0 right-0
                w-[840px] h-[840px]
                opacity-20 z-30 pointer-events-none

                scale-[0.4]
                sm:scale-[0.55]
                md:scale-[0.75]
                lg:scale-100

                origin-top-right
            "
        >
            <img
                src="/images/vectorxe2.png"
                className="absolute"
                style={{ top: "2%", left: "34.5%", width: "48%", height: "22%" }}
                alt=""
            />

            <img
                src="/images/vectorxe3.png"
                className="absolute"
                style={{ top: "10%", left: "31%", width: "50%", height: "65%" }}
                alt=""
            />

            <img
                src="/images/veactorxe1.png"
                className="absolute"
                style={{ top: "13%", left: "18%", width: "15%", height: "58%" }}
                alt=""
            />

            <img
                src="/images/vectorxe4.png"
                className="absolute"
                style={{ bottom: "19%", left: "34.5%", width: "48%", height: "23%" }}
                alt=""
            />
        </div>
    );
}
