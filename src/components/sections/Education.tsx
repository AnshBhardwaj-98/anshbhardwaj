import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";

export const Education = () => {
  return (
    <section id="education" className="py-12 px-6 md:px-20 max-w-7xl mx-auto relative z-10">
      <SectionHeading>Education</SectionHeading>
      <GlassCard>
        <h3 className="text-2xl font-bold text-white">
          Bachelor of Technology in Computer Science (AI & ML)
        </h3>
        <div className="flex flex-wrap justify-between items-center mt-2 text-gray-400">
          <span className="text-lg">Sharda University</span>
          <div className="flex gap-4 font-mono text-sm">
            <span>2022-2026</span>
            <span>Greater Noida, India</span>
          </div>
        </div>

        {/* Satellite Map */}
        <div className="mt-8 overflow-hidden rounded-xl border border-white/10 shadow-lg grayscale-25 hover:grayscale-0 transition-all duration-500">
          <iframe
            src="https://maps.google.com/maps?q=Sharda%20University%20Greater%20Noida&t=k&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sharda University Satellite Map"
          />
        </div>
      </GlassCard>
    </section>
  );
};
