import Link from "next/link";
import DemoChat from "../components/DemoChat";

export default function LandingDraft() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center font-sans">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold mb-4">
            Finally, Split Trip Expenses <span className="text-yellow-300">Without the Drama</span>
          </h1>
          <p className="text-xl mb-8 text-white/90">
            Just tell our AI what you spent. Get instant, clear splits.
          </p>
          <Link href="/chat">
            <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors">
              Try It Now - It's Free! 🚀
            </button>
          </Link>
        </div>
      </div>

      {/* Problem Section - Visual Cards */}
      <div className="py-16 bg-gray-50 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">We&apos;ve All Been There...</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="font-bold mb-2 text-blue-900">Cash Chaos</h3>
              <p className="text-gray-700">Everyone pays different amounts, no digital receipts</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="font-bold mb-2 text-blue-900">Mental Math Hell</h3>
              <p className="text-gray-700">&quot;Who owes what?&quot; becomes a 30-minute calculation</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">😤</div>
              <h3 className="font-bold mb-2 text-blue-900">Awkward Arguments</h3>
              <p className="text-gray-700">Spreadsheets and apps feel like overkill for simple trips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Demo - Real Demo Chat */}
      <div className="py-16 w-full bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">See It In Action</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <DemoChat />
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/chat">
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600">
                Try the Real Thing →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits - Icon + Short Text */}
      <div className="py-16 bg-blue-50 w-full">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Why ChatSplit?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="font-bold mb-2 text-blue-900">Instant Clarity</h3>
                <p className="text-gray-700">No more &quot;Wait, how much do I owe again?&quot;</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🧠</div>
              <div>
                <h3 className="font-bold mb-2 text-blue-900">Zero Mental Load</h3>
                <p className="text-gray-700">Just tell the AI and forget about it</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🤝</div>
              <div>
                <h3 className="font-bold mb-2 text-blue-900">Prevents Arguments</h3>
                <p className="text-gray-700">Clear math that everyone can see</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="font-bold mb-2 text-blue-900">Works on Your Phone</h3>
                <p className="text-gray-700">Add expenses immediately while you&apos;re out</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof - Testimonial Cards */}
      <div className="py-16 w-full">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Loved by Sri Lankan Travelers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-green-200 p-6 rounded-lg">
              <div className="flex mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                <div className="ml-3">
                  <div className="font-semibold text-blue-900">Amara</div>
                  <div className="text-sm text-gray-600">Galle Trip</div>
                </div>
              </div>
              <p className="text-gray-700">&quot;Split our beach trip in seconds! No more Excel headaches.&quot;</p>
            </div>
            <div className="bg-white border-2 border-blue-200 p-6 rounded-lg">
              <div className="flex mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
                <div className="ml-3">
                  <div className="font-semibold text-blue-900">Ravindu</div>
                  <div className="text-sm text-gray-600">Uni Batch Trip</div>
                </div>
              </div>
              <p className="text-gray-700">&quot;Perfect for our Kandy trip. Everyone knew exactly what they owed.&quot;</p>
            </div>
            <div className="bg-white border-2 border-purple-200 p-6 rounded-lg">
              <div className="flex mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
                <div className="ml-3">
                  <div className="font-semibold text-blue-900">Sachini</div>
                  <div className="text-sm text-gray-600">Family Trip</div>
                </div>
              </div>
              <p className="text-gray-700">&quot;No more awkward money conversations at family gatherings!&quot;</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA - Urgent */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white w-full">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to End Expense Drama?</h2>
          <p className="text-xl mb-8 text-white/90">
            Test it with your last trip. See how easy it could have been.
          </p>
          <Link href="/chat">
            <button className="bg-yellow-400 text-black px-10 py-4 rounded-lg text-xl font-bold hover:bg-yellow-300 transition-colors">
              Try ChatSplit Now - Free! 🚀
            </button>
          </Link>
          <p className="text-sm mt-4 text-white/80">No signup required &bull; Works on any device</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between border-t border-blue-100 mt-8 text-sm text-blue-700">
        <Link href="/landing-draft" className="font-bold text-blue-800 mb-2 md:mb-0 hover:underline">ChatSplit</Link>
        <nav className="flex gap-6">
          <Link href="/chat" className="hover:underline transition">Open Chat</Link>
          <a href="#benefits" className="hover:underline transition">Benefits</a>
          <a href="#usecases" className="hover:underline transition">Use Cases</a>
          <a href="#" className="hover:underline transition">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
