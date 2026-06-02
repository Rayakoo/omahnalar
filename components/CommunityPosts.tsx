import { Heart, MessageCircle } from "lucide-react";

const COMMUNITY_POSTS = Array.from({ length: 3 }, () => ({
  author: "Pengguna Anonim",
  time: "2 jam lalu",
  content:
    "Mau nanya, ada yang pernah ngerasain gaslighting dari lingkungan sekitar? Gimana cara kalian deal-nya?",
  likes: 0,
  comments: 0,
}));

export default function CommunityPosts() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            Cerita Terbaru
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-brand-900 mt-3">
            Cerita terbaru dari komunitas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COMMUNITY_POSTS.map((post, idx) => (
          <div
            key={idx}
            className="bg-brand-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                  alt="Anon Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-brand-900">{post.author}</h4>
                  <p className="text-[10px] text-brand-700/60">{post.time}</p>
                </div>
              </div>
              <p className="text-sm text-brand-900/90 leading-relaxed mb-6">
                {post.content}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-brand-700/70 pt-2 border-t border-brand-700/10">
              <button className="flex items-center gap-1 hover:text-brand-900 transition-colors">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-brand-900 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
