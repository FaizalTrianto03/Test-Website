class ProfilingWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    debugPrint('ProfilingWidget is rebuilding!'); // Melacak rebuild
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Profiling Sederhana')),
        body: Center(
          child: Text('Hello, Profiling!'),
        ),
      ),
    );
  }
}
