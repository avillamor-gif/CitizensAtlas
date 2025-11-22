-- Insert default "About" content
INSERT INTO page_content (page_name, card_id, title, icon_name, content, display_order) VALUES
  ('about', 'mission', 'Our Mission', 'document', 'The Citizens'' Atlas is a collaborative, data-driven platform dedicated to mapping and exposing false solutions to the climate and waste crises. Our mission is to empower communities, activists, and policymakers with the tools, data, and stories needed to challenge harmful projects and advocate for genuine, just, and sustainable Zero Waste solutions.', 1),
  ('about', 'vision', 'Our Vision', 'globe', 'We envision a world free from the toxic burden of waste incineration, chemical recycling, and other greenwashed technologies. We believe in a future where resources are valued, consumption is mindful, and communities—especially those most impacted by pollution and environmental injustice—are at the forefront of building circular, resilient, and equitable local economies.', 2),
  ('about', 'problem', 'The Problem We Address', 'search', 'For decades, corporations and governments have promoted capital-intensive, high-tech "solutions" to waste management and climate change that fail to address the root causes of these problems. Projects like waste-to-energy incinerators, plastic-to-fuel schemes, and flawed carbon offsetting projects often receive massive public subsidies and private investment, yet they perpetuate pollution, harm public health, and distract from real solutions.

These false solutions are frequently cloaked in the language of sustainability and progress, making it difficult for communities to recognize the threats they pose. Corruption, lack of transparency, and the exclusion of public participation in decision-making processes further entrench these harmful industries.', 3),
  ('about', 'approach', 'Our Approach', 'lightning', 'The Citizens'' Atlas fights back with transparency. By crowdsourcing and verifying data on these projects, we create a living map that reveals the true scale and impact of false solutions around the globe. We track financial flows, identify the corporations and institutions involved, and document community resistance.

This platform is more than just a map—it''s a resource hub, a storytelling platform, and a network for global solidarity. We provide case studies, research materials, and advocacy tools to support local campaigns and inform international policy debates.', 4)
ON CONFLICT (page_name, card_id) DO NOTHING;

-- Insert default "Partner" content
INSERT INTO page_content (page_name, card_id, title, icon_name, content, display_order) VALUES
  ('partner', 'why-collaborate', 'Why Collaborate?', 'globe', 'The fight for environmental justice is a collective effort. By sharing knowledge, resources, and strategies, we can amplify our impact and accelerate the transition to a Zero Waste future. Your expertise and on-the-ground knowledge are invaluable to this mission.', 1),
  ('partner', 'submit-project', 'Submit a Project', 'map-pin', 'Are you aware of a polluting incinerator, a risky chemical recycling plant, or a greenwashed project in your community? Help us put it on the map. We are looking for data on:

• Project locations and technical details
• Corporate and financial backers
• Community opposition and resistance efforts
• Environmental and social impact assessments', 2),
  ('partner', 'share-story', 'Share Your Story', 'play', 'Personal stories are powerful tools for change. We want to feature the voices of community leaders, activists, and waste workers who are fighting false solutions. Share your experience with:

• Organizing your community
• Advocating with policymakers
• The impacts of pollution on your health and livelihood
• Successful campaigns for Zero Waste', 3)
ON CONFLICT (page_name, card_id) DO NOTHING;

-- Verify the data was inserted
SELECT page_name, card_id, title, display_order 
FROM page_content 
WHERE page_name IN ('about', 'partner') 
ORDER BY page_name, display_order;
