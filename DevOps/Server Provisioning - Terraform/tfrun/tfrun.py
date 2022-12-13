from python_terraform import Terraform

tf = Terraform(working_dir='./')


tf.init()
tf.plan()
print(tf.apply(skip_plan=True))
#print(tf.destroy())

# print(tf.destroy(force=IsFlagged))