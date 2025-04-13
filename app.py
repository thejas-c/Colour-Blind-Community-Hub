from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/resources')
def resources():
    return render_template('resources.html')

@app.route('/community')
def community():
    return render_template('community.html')

@app.route('/advocacy')
def advocacy():
    return render_template('advocacy.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/blogs')
def blogs():
    return render_template('blogs.html')

@app.route('/tools')
def tools():
    return render_template('tools.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/join-community', methods=['POST'])
def join_community():
    email = request.json.get('email')

    if not email:
        return jsonify({'message': 'Email is required.'}), 400

    try:
        # Create the email message
        msg = MIMEText("You’re in great company, joining our community of people who are enthusiastic to learn about color blindness and help others.\n\nWith Color Blindness Community Hub , you can gain knowledge about color blindness and you can connect with the people who are interesting.\n\nWe know that taking the first steps isn’t always easy, so we’re here to ensure you hit the ground running, on the right foot.\n\nRegards,\nColor Blindness Community Hub.")
        msg['Subject'] = "Welcome to the Community of Color Blind Awareness!"
        msg['From'] = 'colourblindnesscommunityhub@gmail.com'
        msg['To'] = email

        # Connect to the SMTP server
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp: 
            smtp.login('colourblindnesscommunityhub@gmail.com', 'nlmavjuewazvijgg')
            smtp.send_message(msg)

        print(f"Email sent to: {email}")
        return jsonify({'message': 'Email sent successfully!'}), 200

    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'message': 'Failed to send email.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
