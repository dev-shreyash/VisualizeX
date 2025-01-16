"use client";

export default function HowToUsePage() {
  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">How to Use VisualizeX</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            VisualizeX combines the power of an Algorithm Visualizer with an Online IDE to provide a seamless learning and development experience. Follow these steps to get started:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Sign Up or Log In:</strong> Use the login page to access your account. If you don't have an account, register using the sign-up form.
            </li>
            <li>
              <strong>Access the Dashboard:</strong> Navigate to the dashboard, where you'll find access to the Algorithm Visualizer and Online IDE.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Using the Algorithm Visualizer</h2>
          <p className="mb-4">
            The Algorithm Visualizer helps you understand how algorithms work through step-by-step visualizations. Here's how to use it:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Select an Algorithm:</strong> Use the dropdown menu to choose an algorithm (e.g., Bubble Sort, Quick Sort, etc.).
            </li>
            <li>
              <strong>Input Data:</strong> Customize the input data or use the default values provided for the algorithm.
            </li>
            <li>
              <strong>Visualize:</strong> Click on the **Visualize** button to see the algorithm in action. Use the controls to:
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Play or pause the visualization.</li>
                <li>Step through the visualization process one step at a time.</li>
                <li>Adjust the speed to observe the algorithm at your preferred pace.</li>
              </ul>
            </li>
            <li>
              <strong>Analyze Metrics:</strong> Review time complexity, step counts, and other performance metrics displayed alongside the visualization.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Using the Online IDE</h2>
          <p className="mb-4">
            The Online IDE allows you to write, edit, and execute code directly within VisualizeX. Follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Write Your Code:</strong> Use the editor to write or paste your code. You can choose the language you want to use.
            </li>
            <li>
              <strong>Run Your Code:</strong> Click the **Run** button to execute your code. The output, including any errors, will be displayed in the output window.
            </li>
            <li>
              <strong>Switch Between Algorithms and IDE:</strong> Seamlessly transition between the Algorithm Visualizer and Online IDE from the dashboard.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Updating Profile Information</h2>
          <p className="mb-4">
            You can easily update your profile information, such as email and password, from your dashboard:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Navigate to the **Dashboard**.</li>
            <li>Locate the **Profile Settings** section.</li>
            <li>
              Update your email or password and click **Save Changes**. A confirmation message will appear once the changes are applied.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">1. What algorithms are available for visualization?</h3>
              <p>
                The tool supports various algorithms, including sorting algorithms (Bubble Sort, Merge Sort), searching algorithms, and graph traversal algorithms like BFS and DFS.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">2. Can I add custom input data?</h3>
              <p>
                Yes, you can manually input custom data or use the default dataset provided for each algorithm.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">3. What programming languages are supported in the IDE?</h3>
              <p>
                The IDE currently supports popular programming languages like JavaScript, Python, and C++. More languages may be added in future updates.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">4. How do I report a bug or suggest a feature?</h3>
              <p>
                You can report issues or suggest features by reaching out to the support team via the **Contact Us** section in the app.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">5. Is my data secure?</h3>
              <p>
                Yes, VisualizeX prioritizes data security by using encryption and secure authentication mechanisms.
              </p>
            </div>
          </div>
          <hr />
          <p className="mt-4 text-red-400">*Note some mentioned features may still be under development.*</p>
        </section>
      </div>
    </div>
  );
}
