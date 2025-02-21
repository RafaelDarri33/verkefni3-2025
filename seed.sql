-- Bæta við flokkum
INSERT INTO categories (name) VALUES ('HTML'), ('CSS'), ('JavaScript');

-- Bæta við spurningum
INSERT INTO questions (category_id, question) VALUES
    (1, 'Hvað stendur HTML fyrir?'),
    (2, 'Hvernig á að breyta bakgrunnslit í CSS?'),
    (3, 'Hvað gerir `let` í JavaScript?');

-- Bæta við svörum
INSERT INTO answers (question_id, answer, is_correct) VALUES
    (1, 'HyperText Markup Language', TRUE),
    (1, 'Hyper Transfer Markup Language', FALSE),
    (2, 'background-color:', TRUE),
    (2, 'bg-color:', FALSE),
    (3, 'Skilgreinir breytu sem hægt er að uppfæra', TRUE),
    (3, 'Býr til fasta breytu', FALSE);
