import { SectionHeading } from "../ui/SectionHeading";

export const Education = () => {
  return (
    <section id="education" className="py-32 px-6 md:px-24 bg-surface-base relative overflow-hidden">
      <div className="absolute inset-0 checkered-pattern opacity-[0.01]" />
      
      <SectionHeading align="right">Engineering Academy</SectionHeading>
      
      <div className="bg-surface-container p-12 md:p-20 relative z-10 hover:bg-surface-layered transition-colors duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-6">
            <span className="px-4 py-1.5 bg-ignitionRed text-white text-[10px] font-black uppercase tracking-[0.3em] italic">Class of 2026</span>
            <h3 className="text-4xl md:text-6xl font-black text-chassis uppercase tracking-tighter leading-none italic">
              B.Tech in Computer Science <br />
              <span className="text-chassis/30">(AI & ML)</span>
            </h3>
            <p className="text-xl font-display font-bold text-chassis italic">Sharda University, India</p>
          </div>
          
          <div className="w-full md:w-1/3 bg-surface-base p-8 border-l-4 border-telemetryYellow">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-chassis/40 mb-4">Core Track</h4>
            <ul className="space-y-3">
              {['Advanced AI', 'Deep Learning', 'System Arch', 'Robotics'].map(item => (
                <li key={item} className="text-sm font-bold uppercase text-chassis">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Satellite Map - Sharp Edges */}
        <div className="mt-16 overflow-hidden rounded-none border-t-8 border-chassis shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe
            src="https://maps.google.com/maps?q=Sharda%20University%20Greater%20Noida&t=k&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sharda University Satellite Map"
          />
        </div>
      </div>
    </section>
  );
};
