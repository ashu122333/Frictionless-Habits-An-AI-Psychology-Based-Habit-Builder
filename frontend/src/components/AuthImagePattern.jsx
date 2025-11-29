const AuthImagePattern = ({ title, subtitle }) => (
  <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-12">
    <div className="max-w-md text-center">
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
      <p className="text-white/80 text-lg">{subtitle}</p>
    </div>
  </div>
);
  export default AuthImagePattern;