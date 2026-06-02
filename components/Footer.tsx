

const FOOTER_LINKS = [
  {
    title: "Tentang",
    links: ["Siapa Kami", "Program Kami", "Tim Kami", "Karir"],
  },
  {
    title: "Program",
    links: ["Omah Cerita", "Omah Belajar", "Tanya Nalar", "Produk"],
  },
  {
    title: "Dukungan",
    links: ["FAQ", "Hubungi Kami", "Pusat Bantuan", "Konfirmasi Pembayaran"],
  },
  {
    title: "Ikuti Kami",
    links: ["Instagram", "Twitter", "Youtube", "Facebook"],
  },
];

const SOCIAL_ICONS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    href: "#",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-3.594-1.555c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 3.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557z"/>
      </svg>
    ),
    href: "#",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    href: "#",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-secondary-500/50" />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-page-50 font-bold text-sm mb-5 uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-brand-100/70 hover:text-page-50 transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-100/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-page-50 rounded-lg flex items-center justify-center text-brand-900 font-bold text-sm shadow-sm">
              Ω
            </div>
            <span className="text-sm text-brand-100/60">Omah Nalar</span>
          </div>

          <div className="flex items-center gap-4">
            {SOCIAL_ICONS.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                className="w-9 h-9 rounded-full bg-brand-700/20 flex items-center justify-center text-brand-100/70 hover:bg-brand-700/40 hover:text-page-50 transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p className="text-xs text-brand-100/40">
            &copy; 2026 Omah Nalar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
