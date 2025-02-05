import sqlite3
import json
from pathlib import Path

def connect_to_db():
    """Connect to the SQLite database"""
    try:
        db_path = '../piikkilaite/db/sqlite-prod.db'
        conn = sqlite3.connect(db_path)
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def export_table_to_json(conn, table_name, output_file):
    """Export a table's contents to a JSON file"""
    try:
        # Get all rows from the table
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name}")

        # Get column names
        columns = [description[0] for description in cursor.description]

        # Fetch all rows and convert to list of dictionaries
        rows = cursor.fetchall()
        data = []
        for row in rows:
            data.append(dict(zip(columns, row)))

        # Write to JSON file
        output_path = Path(f'./exported_{table_name}.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"Successfully exported {table_name} to {output_path}")

    except sqlite3.Error as e:
        print(f"Error exporting {table_name}: {e}")

def main():
    # Connect to database
    conn = connect_to_db()
    if not conn:
        return

    try:
        # Export users and prices tables
        export_table_to_json(conn, 'users', 'exported_users.json')
        export_table_to_json(conn, 'prices', 'exported_prices.json')

    finally:
        conn.close()

if __name__ == "__main__":
    main()
