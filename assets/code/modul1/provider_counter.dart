class CounterWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final counterProvider = Provider.of<CounterProvider>(context);

    return Column(
      children: [
        Text('Counter: ${counterProvider.counter}'),
        ElevatedButton(
          onPressed: counterProvider.incrementCounter,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
