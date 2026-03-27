import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const handleIncrement = (): void => {
    setCount(count + 1);
  };

  const handleDecrement = (): void => {
    setCount(count - 1);
  };

  const handleReset = (): void => {
    setCount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>

      <View style={styles.buttons}>
        <Button title="+" onPress={handleIncrement} />
        <Button title="-" onPress={handleDecrement} />
        <Button title="Reset" onPress={handleReset} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'center',
  },
});

export default Counter;